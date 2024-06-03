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
                 "User-Agent" => "googlebot"
             ];
            curl_setopt_array($ch, [
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_USERAGENT => "googlebot",
                CURLOPT_HTTPHEADER => $headers,
                CURLOPT_TIMEOUT => 15,
                CURLOPT_CUSTOMREQUEST => "GET",
            ]);
             $content = curl_exec($ch);
             $error =  curl_error($ch);
             curl_close($ch);
            if ($error) {
              throw new \Exception('Could not fetch content from url' . $error);
            }
            return Parser::parse($content);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}
