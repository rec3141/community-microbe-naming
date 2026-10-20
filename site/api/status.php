<?php
require __DIR__ . '/lib.php';
$ok = !empty(config()['ANTHROPIC_API_KEY']);
send_json(200, $ok ? ['ok' => true, 'model' => prompt_cfg()['model']] : ['ok' => false, 'error' => 'API key not configured']);
