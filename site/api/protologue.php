<?php
// POST {saved-name fields} -> {etymology, checks, suggested_name}
require __DIR__ . '/lib.php';
set_time_limit(150);
if ($_SERVER['REQUEST_METHOD'] !== 'POST') send_json(405, ['error' => 'POST only']);
$key = config()['ANTHROPIC_API_KEY'] ?? '';
if ($key === '') send_json(503, ['error' => 'API key not configured']);
$raw = file_get_contents('php://input', false, null, 0, 20000);
$n = json_decode($raw, true);
if (!is_array($n) || clean($n['name'] ?? '') === '') send_json(400, ['error' => 'missing name']);
if (!take_quota()) send_json(429, ['error' => "Today's drafting limit has been reached. Try again tomorrow."]);

$P = prompt_cfg();
$body = [
    'model' => $P['model'], 'max_tokens' => $P['max_tokens'], 'system' => $P['system'],
    'tools' => [$P['tool']], 'tool_choice' => ['type' => 'auto'],
    'messages' => [['role' => 'user', 'content' => build_prompt($n)]],
];
$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
    CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 140,
    CURLOPT_HTTPHEADER => ['x-api-key: ' . $key, 'anthropic-version: 2023-06-01', 'content-type: application/json'],
    CURLOPT_POSTFIELDS => json_encode($body, JSON_UNESCAPED_UNICODE),
]);
$out = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);
curl_close($ch);
if ($out === false) send_json(502, ['error' => "Could not reach the API: $err"]);
$res = json_decode($out, true);
if ($code !== 200) send_json(502, ['error' => "API error $code: " . ($res['error']['message'] ?? substr($out, 0, 300))]);
$text = '';
foreach ($res['content'] ?? [] as $b) {
    if (($b['type'] ?? '') === 'tool_use' && ($b['name'] ?? '') === 'protologue') send_json(200, $b['input']);
    if (($b['type'] ?? '') === 'text') $text .= $b['text'];
}
// fallback: the same fields as a JSON object in the text
$i = strpos($text, '{'); $j = strrpos($text, '}');
$obj = ($i !== false && $j > $i) ? json_decode(substr($text, $i, $j - $i + 1), true) : null;
if (is_array($obj)) send_json(200, $obj);
send_json(502, ['error' => 'API returned no protologue']);
