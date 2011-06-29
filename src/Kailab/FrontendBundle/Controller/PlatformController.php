<?php

namespace Kailab\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Kailab\FrontendBundle\Asset\AssetInterface;
use Kailab\FrontendBundle\Asset\ParameterAsset;
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

        $imagine = new Imagine();
        $image = $imagine->load($icon->getContent());
        $image = $image->resize(new Box(30,30), ImageInterface::THUMBNAIL_OUTBOUND);

        $icon = new ParameterAsset(array(
            'content'       => $image->get('png'),
            'content_type'  => 'image/png'
        ));

        return $icon->getResponse();
    }

}
