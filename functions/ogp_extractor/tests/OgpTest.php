<?php

namespace OGP\Tests\Unit;

use OGP\Ogp;
use PHPUnit\Framework\TestCase;

class OgpTest extends TestCase
{
    public function testOgp()
    {
        $ogp = Ogp::getData("https://github.com/janhq/jan");
        $this->assertArrayHasKey('title', $ogp);
        $this->assertArrayHasKey('og:description', $ogp);
        $this->assertArrayHasKey('og:image', $ogp);
    }

}
