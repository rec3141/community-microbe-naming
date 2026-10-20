<?php
// Shared helpers for the naming API on shared hosting (DreamHost).
// The API key lives OUTSIDE the web root, in ~/.<env_slug>.env (env_slug from prompt.json):
//   ANTHROPIC_API_KEY=...
//   DAILY_LIMIT=400        (optional; drafts allowed per day, all users combined)
const GENDER = ['m' => 'masculine', 'f' => 'feminine', 'n' => 'neuter'];

function home_dir() { return dirname(__DIR__, 3); }  // ~/<domain>/<site>/api -> ~ (adjust if the site sits deeper)
function slug() { return preg_replace('/[^a-z0-9_-]/', '', prompt_cfg()['env_slug'] ?? 'microbe-naming'); }

function config() {
    static $cfg = null;
    if ($cfg === null) {
        $cfg = [];
        $f = home_dir() . '/.' . slug() . '.env';
        if (is_readable($f)) {
            foreach (file($f, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
                if ($line[0] === '#' || strpos($line, '=') === false) continue;
                [$k, $v] = explode('=', $line, 2);
                $cfg[trim($k)] = trim(trim($v), "'\"");
            }
        }
    }
    return $cfg;
}

function prompt_cfg() { return json_decode(file_get_contents(__DIR__ . '/prompt.json'), true); }

function send_json($code, $obj) {
    http_response_code($code);
    header('Content-Type: application/json');
    header('Cache-Control: no-store');
    echo json_encode($obj, JSON_UNESCAPED_UNICODE);
    exit;
}

// count one draft against today's limit; false when the limit is reached
function take_quota() {
    $limit = (int)(config()['DAILY_LIMIT'] ?? 400);
    $dir = home_dir() . '/.' . slug() . '-usage';
    if (!is_dir($dir)) mkdir($dir, 0700);
    $fh = fopen($dir . '/' . gmdate('Y-m-d'), 'c+');
    flock($fh, LOCK_EX);
    $n = (int)stream_get_contents($fh);
    $ok = $n < $limit;
    if ($ok) { ftruncate($fh, 0); rewind($fh); fwrite($fh, (string)($n + 1)); }
    flock($fh, LOCK_UN); fclose($fh);
    return $ok;
}

// strings only, length-capped, so the endpoint can only be used for name drafting
function clean($v, $max = 300) {
    return is_scalar($v) ? mb_substr(trim((string)$v), 0, $max) : '';
}

// Keep in step with prompt_for() in naming_api.py
function build_prompt($n) {
    $lang = prompt_cfg()['language'] ?? 'local-language';
    $g = fn($k, $max = 300) => clean($n[$k] ?? '', $max);
    $syl = fn($k) => $g($k) !== '' ? ' (' . $g($k) . ')' : '';
    $L = ['Proposed name: ' . $g('name', 80) . ' ' . $g('rank', 40),
          'Genus gender: ' . (GENDER[$g('gender')] ?? ($g('gender') ?: 'unknown'))];
    $end = fn($k) => $g($k . '_ending') !== '' ? ', + ending -' . $g($k . '_ending') . ' (' . $g($k . '_ending_meaning') . ')' : ', used without an ending';
    if ($g('genus_word') !== '')
        $L[] = "Genus built from $lang '" . $g('genus_word') . "'" . $syl('genus_syl') . ", meaning '" . $g('genus_meaning') . "'" . $end('genus');
    else
        $L[] = 'Genus already validly named; only the species is new.';
    $L[] = "Species epithet built from $lang '" . $g('species_word') . "'" . $syl('species_syl') . ", meaning '" . $g('species_meaning') . "'" . $end('species');
    if ($g('edited') !== '') $L[] = 'The spelling was edited by hand; base the etymology on the proposed name exactly as written.';
    if ($g('higher_taxa') !== '') $L[] = 'New higher taxa formed from the genus: ' . $g('higher_taxa');
    return implode("\n", $L);
}
