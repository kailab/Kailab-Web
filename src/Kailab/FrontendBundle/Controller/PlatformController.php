<?php

namespace Kailab\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\Response;
use Kailab\FrontendBundle\Asset\AssetInterface;
use Imagine\ImageInterface;
use Imagine\Gd\Imagine;
use Imagine\Image\Box;

class PlatformController extends Controller
{
    public function iconAction($id)
    {
        $em = $this->get('doctrine')->getEntityManager();
        $repo = $em->getRepository('KailabFrontendBundle:Platform');

        $platform = $repo->find($id);
        if(!$platform){
            throw new NotFoundHttpException('The platform does not exist.');
        }
        $icon = $platform->getIcon();
        if(!$icon instanceof AssetInterface){
            throw new NotFoundHttpException('The platform does not have a valid icon.');
        }
        return $icon->getResponse();
    }

}
