<?php

require(__DIR__ . '/../vendor/autoload.php');

use OGP\Ogp;

// This is your Appwrite function
// It's executed each time we get a request
return function ($context) {
    try {
        if (!isset($context->req->query['url'])) {
            $context->error("No url query parameter");
            return $context->res->json(["error" => "url query parameter is required"]);
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
                return $context->res->json(["error" => "Could not fetch content from url. See Developer Console for more details"]);
            }
        }
        return $context->res->json(["error" => "Invalid request method"]);
    } catch (\Throwable $e) {
        $context->error("An error occurred: " . $e->getMessage());
        return $context->res->json(["error" => "An error occurred. See Developer Console for more details"]);
    }
};
