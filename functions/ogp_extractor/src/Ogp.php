<?php

namespace OGP;

class Ogp
{

    public static function getData(string $url): array{
        $content = file_get_contents($url);
        if($content === false){
            throw new \Exception('Could not fetch content from url');
        }
        return Parser::parse($content);
    }

}