<?php

require(__DIR__ . '/../vendor/autoload.php');

use OGP\Ogp;

return function ($context) {
    try {
        if (!isset($context->req->query['url'])) {
            $context->error("No url query parameter");
            return $context->res->json(["error" => "url query parameter is required"],400);
        }

        $url = urldecode($context->req->query['url']);
        $context->log("This is the url" . $url);

        // If the request method is GET, return the complete OGP data
        if ($context->req->method === 'GET') {
            try {
                $ogp = Ogp::getData($url);
                return $context->res->json($ogp);
            } catch (\Throwable $e) {
                $context->error($e->getMessage());
                return $context->res->json(["error" => "Could not fetch content from url. See Developer Console for more details"],500);
            }
        }
        // TODO: Add POST method to selectively fetch OGP data
        return $context->res->json(["error" => "Invalid request method"],400);
    } catch (\Throwable $e) {
        $context->error("An error occurred: " . $e->getMessage());
        return $context->res->json(["error" => "An error occurred. See Developer Console for more details"],500);
    }
};
