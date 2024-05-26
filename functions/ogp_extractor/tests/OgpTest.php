<?php

namespace OGP\Tests\Unit;

use OGP\Ogp;
use PHPUnit\Framework\TestCase;

class OgpTest extends TestCase
{
    public function testOgp()
    {
        \var_dump(__DIR__);
        $ogp = Ogp::getData("https://www.youtube.com/watch?v=EIGGsZZWzZA");
        $this->assertArrayHasKey('og:title', $ogp);
        $this->assertArrayHasKey('og:description', $ogp);
        $this->assertArrayHasKey('og:image', $ogp);
    }

}