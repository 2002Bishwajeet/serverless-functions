<?php

/**
 * 
 * Open Graph Protocol parser.
 * Very simple open graph parser that parses open graph headers out of a given bit of php.
 *
 * Example:
 *
 * @author Bishwajeet Parhi <bishwajeet.techmaster@gmail.com>
 * @licence MIT
 */

namespace OGP;

use DOMDocument;

class Parser
{

    /**
     * Parse content into an array.
     * @param $content string The HTML
     * @return array
     */
    public static function parse(string $content)
    {

        $doc = new DOMDocument();

        // Fudge to handle a situation when an encoding isn't present
        if (strpos($content, 'xml encoding=') === false)
            $content = '<?xml encoding="utf-8" ?>' . $content;

        @$doc->loadHTML($content);

        $interested_in = ['og', 'twitter']; // Open graph namespaces we're interested in (open graph + extensions)

        $ogp = [];

        // Open graph
        $metas = $doc->getElementsByTagName('meta');
        if (!empty($metas)) {
            for ($n = 0; $n < $metas->length; $n++) {

                $meta = $metas->item($n);

                foreach (array('name', 'property') as $name) {
                    $meta_bits = explode(':', $meta->getAttribute($name));
                    if (in_array($meta_bits[0], $interested_in)) {

                        // If we're adding to an existing element, convert it to an array
                        if (isset($ogp[$meta->getAttribute($name)]) && (!is_array($ogp[$meta->getAttribute($name)])))
                            $ogp[$meta_bits[0]][$meta->getAttribute($name)] = array($ogp[$meta->getAttribute($name)], $meta->getAttribute('content'));
                        else if (isset($ogp[$meta->getAttribute($name)]) && (is_array($ogp[$meta->getAttribute($name)])))
                            $ogp[$meta_bits[0]][$meta->getAttribute($name)][] = $meta->getAttribute('content');
                        else
                            $ogp[$meta_bits[0]][$meta->getAttribute($name)] = $meta->getAttribute('content');
                    }
                }
            }
        }

        // OEmbed
        $metas = $doc->getElementsByTagName('link');
        if (!empty($metas)) {
            for ($n = 0; $n < $metas->length; $n++) {

                $meta = $metas->item($n);

                if (strtolower($meta->getAttribute('rel')) == 'alternate') {

                    if (in_array(strtolower($meta->getAttribute('type')), ['application/json+oembed'])) {
                        $ogp['oembed']['jsonp'][] = $meta->getAttribute('href');
                    }
                    if (in_array(strtolower($meta->getAttribute('type')), ['text/json+oembed'])) {
                        $ogp['oembed']['json'][] = $meta->getAttribute('href');
                    }
                    if (in_array(strtolower($meta->getAttribute('type')), ['text/xml+oembed'])) {
                        $ogp['oembed']['xml'][] = $meta->getAttribute('href');
                    }
                }
            }

            $ogp = self::parseTwitterOEmbed($metas, $ogp);
        }

        // Basics
        foreach (['title'] as $basic) {
            if (preg_match("#<$basic>(.*?)</$basic>#siu", $content, $matches))
                $ogp[$basic] = trim($matches[1], " \n");
        }
        $metas = $doc->getElementsByTagName('meta');
        if (!empty($metas)) {
            for ($n = 0; $n < $metas->length; $n++) {

                $meta = $metas->item($n);

                if (strtolower($meta->getAttribute('name')) == 'description') {
                    $ogp['description'] = $meta->getAttribute('content');
                }
                if (strtolower($meta->getAttribute('name')) == 'keywords') {
                    $ogp['keywords'] = $meta->getAttribute('content');
                }
            }
        }

        return $ogp;
    }

    /**
     * For Twitter API reference,
     * see https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/get-statuses-oembed
     */
    private static function parseTwitterOEmbed(\DOMNodeList $metas, array $ogp): array
    {
        if (isset($ogp['oembed']['jsonp'])) {
            return $ogp;
        }

        $canonicalLinks = array_filter(
            // List link nodes
            iterator_to_array($metas),
            // Filter HTML link tags to preserve those having
            // a "rel" attribute and a "canonical" value for this attribute
            function ($meta) {
                $canonicalLinks = array_filter(
                    array_values(
                        // List DOM attributes for each link node
                        iterator_to_array($meta->attributes)
                    ),
                    // Expect to find an attribute having
                    // - "rel" name and
                    // - "canonical" value
                    function ($attr) {
                        return $attr->name === 'rel' && $attr->value === 'canonical';
                    }
                );

                return count($canonicalLinks) > 0;
            }
        );

        if (count($canonicalLinks) >= 1) {
            // Reorder list from zero index
            /** @var \DOMNode[] $links */
            $links              = array_values($canonicalLinks);
            $firstCanonicalLink = $links[0]->getAttribute('href');

            if (
                !empty(trim($firstCanonicalLink))
                && preg_match('#^https://(www\.|mobile\.)?twitter\.com#i', $firstCanonicalLink) === 1
            ) {
                $ogp['oembed'] = [
                    'jsonp' => [
                        implode(
                            [
                                'https://publish.twitter.com/oembed?url=',
                                $firstCanonicalLink,
                                '&align=center'
                            ]
                        )
                    ]
                ];
            }
        }

        return $ogp;
    }
}
