<?php

require_once(__DIR__ . '/../vendor/autoload.php');

use OGP\Ogp;


return function ($context) {
    // the url must have the query string
    // if the query isn't present, return with an error
    try {
        if(!isset($context->req->query['url'])){
            $context->error("No url query parameter");
            return $context->res->json(["error" => "url query parameter is required"]);
        }

        $url = $context->req->query['url'];



        // If the request method is GET, return the complete OGP data
        if ($context->req->method === 'GET') {
            try {
                $ogp = Ogp::getData($url);
                return $context->res->json($ogp);

            } catch (\Exception $e) {
                $context->error("Could not fetch content from url" . $e->getMessage());
                return $context->res->json(["error" => "Could not fetch content from url. See Developer Console for more details"]);
            }
        }
        return $context->res->json(["error" => "Invalid request method"]);

    } catch (\Exception $e) {
        $context->error("An error occurred: " . $e->getMessage());
        return $context->res->json(["error" => "An error occurred. See Developer Console for more details"]);
    }

};