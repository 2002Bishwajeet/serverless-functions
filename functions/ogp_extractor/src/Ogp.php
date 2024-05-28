<?php

namespace OGP;


class Ogp
{

    public static function getData(string $url): array
    {
        try {
             $ch = curl_init($url);
             $headers = [
                 "Content-Type" => "text/html",
             ];
             curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
             curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
             curl_setopt($ch, CURLOPT_HTTPGET, true);
             $content = curl_exec($ch);
            if (!$content) {
                throw new \Exception('Could not fetch content from url' . $content);
            }
            return Parser::parse($content);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}
