<?php

// Relative to the PHP app,
// Directory where the Vue dist files are mounted by the PHP app.
define('VUE_DIST_PATH', '/vue-dist');

class VueAssetLoader
{
    private $manifestPath;
    private $manifest;
    private $baseUrl;

    public function __construct($manifestPath = VUE_DIST_PATH . '/.vite/manifest.json', $baseUrl = VUE_DIST_PATH)
    {
        $this->manifestPath = $_SERVER['DOCUMENT_ROOT'] . $manifestPath;
        $this->baseUrl = $baseUrl;
        $this->loadManifest();
    }

    private function loadManifest()
    {
        if (!file_exists($this->manifestPath)) {
            throw new Exception('Vue manifest file not found. Make sure to build the Vue app first.');
        }

        $this->manifest = json_decode(file_get_contents($this->manifestPath), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Failed to parse Vue manifest file.');
        }
    }

    public function getEntryScripts()
    {
        $scripts = [];
        foreach ($this->manifest as $key => $entry) {
            if (isset($entry['file']) && str_ends_with($entry['file'], '.js')) {
                $scripts[] = $this->baseUrl . '/' . $entry['file'];
            }
        }
        return $scripts;
    }

    public function getEntryStyles()
    {
        $styles = [];
        foreach ($this->manifest as $key => $entry) {
            if (isset($entry['css'])) {
                foreach ($entry['css'] as $cssFile) {
                    $styles[] = $this->baseUrl . '/' . $cssFile;
                }
            }
        }
        return $styles;
    }

    public function renderScripts()
    {
        $html = '';
        foreach ($this->getEntryScripts() as $script) {
            $html .= sprintf('<script type="module" src="%s"></script>', $script);
        }
        return $html;
    }

    public function renderStyles()
    {
        $html = '';
        foreach ($this->getEntryStyles() as $style) {
            $html .= sprintf('<link rel="stylesheet" href="%s">', $style);
        }
        return $html;
    }
}
