<?php

namespace Kailab\FrontendBundle\Asset;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class EmptyAsset implements AssetInterface
{
    protected $exception = true;

    public function __construct($exception=true)
    {
        $this->exception = $exception;
    }
    public function getName()
    {
    }

    public function getContent()
    {
    }

    public function getContentType()
    {
    }

    public function getResponse()
    {
        if($this->exception){
            throw new NotFoundHttpException('Empty asset response.');
        }
        $response = new Response('',404);
        return $response;
    }

}

