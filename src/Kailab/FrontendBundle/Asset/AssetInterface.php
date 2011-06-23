<?php

namespace Kailab\FrontendBundle\Asset;

interface AssetInterface
{
    public function getName();
    public function getContent();
    public function getContentType();
    public function getResponse();
}
