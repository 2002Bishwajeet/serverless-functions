<?php

namespace OGP\Tests\Unit;

use OGP\Ogp;
use PHPUnit\Framework\TestCase;

class OgpTest extends TestCase
{
    public function testGithubUrl()
    {
        $ogp = Ogp::getData("https://github.com/janhq/jan");
        $this->assertArrayHasKey('title', $ogp, 'Title not found');
        $this->assertArrayHasKey('description', $ogp, 'Description not found');
        $this->assertArrayHasKey('og', $ogp);
        $this->assertArrayHasKey('twitter', $ogp);

    }

    public function testTwitterUrl()
    {
        $ogp = Ogp::getData("https://x.com/trunkio/status/1795913092204998997");
        $this->assertArrayHasKey('og:title', $ogp['og'], 'Title not found');
        $this->assertArrayHasKey('description', $ogp);


    }

    public function testYoutubeUrl()
    {
        $ogp = Ogp::getData("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        $this->assertArrayHasKey('title', $ogp, 'Title not found');
        $this->assertArrayHasKey('description', $ogp, 'Description not found');
        $this->assertArrayHasKey('og', $ogp);
        $this->assertArrayHasKey('twitter', $ogp);

    }

    public function testLinkedInUrl()
    {
        $ogp = Ogp::getData("https://www.linkedin.com/posts/flutterdevofficial_calling-all-ai-innovators-join-the-gemini-activity-7201613262163984386-MkaU");
        $this->assertArrayHasKey('title', $ogp, 'Title not found');
        $this->assertArrayHasKey('description', $ogp, 'Description not found');
        $this->assertArrayHasKey('og', $ogp);
        $this->assertArrayHasKey('twitter', $ogp);

    }

    public function testInstagramUrl()
    {
        $ogp = Ogp::getData("https://www.instagram.com/reel/C7fhXWKJNeU/");
        $this->assertArrayHasKey('title', $ogp, 'Title not found');
        $this->assertArrayHasKey('description', $ogp, 'Description not found');
        $this->assertArrayHasKey('og', $ogp);
        $this->assertArrayHasKey('twitter', $ogp);
    }

    public function testHtmlUrl()
    {
        $ogp = Ogp::getData("https://simonwillison.net/2024/May/29/training-not-chatting/");
        $this->assertArrayHasKey('title', $ogp, 'Title not found');
        $this->assertArrayHasKey('description', $ogp, 'Description not found');
        $this->assertArrayHasKey('og', $ogp);
        $this->assertArrayHasKey('twitter', $ogp);
    }

    public function testError()
    {
        $ogp = Ogp::getData("");
    $this->expectException(\Exception::class);
    }

}
