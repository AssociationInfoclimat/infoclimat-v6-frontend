<?php

// Principle is to embed the Vue3 app in the PHP app.
// 1. We just get the manifest.json file that comes from the dist/build of the app.
// 2. We use this manifest to find the js/css files.
// 3. Simply embed them and just create the div so the Vue3 app can be mounted.

// TODO: We coulmd even make this work in dev mode, 
//  by finding the js/css paths using the http://localhost:5173/.vite paths

require_once 'VueAssetLoader.php';

try {
    $vueLoader = new VueAssetLoader();
} catch (Exception $e) {
    die('Error loading Vue assets: ' . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP + Vue.js Integration</title>
    <?php echo $vueLoader->renderStyles(); ?>
</head>

<body>
    <div id="app"></div>
    <?php echo $vueLoader->renderScripts(); ?>
</body>

</html>