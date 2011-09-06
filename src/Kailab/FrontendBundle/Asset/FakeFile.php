<?php

namespace Kailab\FrontendBundle\Asset;

use Symfony\Component\HttpFoundation\File\File;

class FakeFile extends File
{
    protected $mime_type;

    public function __construct($mime_type)
    {
        $this->mime_type = $mime_type;
    }

    public function getMimeType()
    {
        return $this->mime_type;
    }

}
