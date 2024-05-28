<?php

namespace OGP;

class Ogp
{

    public static function getData(string $url): array
    {
        try {
            // No need for this . I made a mistake somewhere else. The url needs to be decoded.
            // $ch = curl_init($url);
            // $headers = [
            //     "Content-Type" => "text/html",
            // ];
            // curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            // curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            // curl_setopt($ch, CURLOPT_HTTPGET, true);
            // $content = curl_exec($ch);
            $content = file_get_contents($url);
            if (!$content) {
                throw new \Exception('Could not fetch content from url' . $content);
            }
            return Parser::parse($content);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}
