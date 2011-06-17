<?php

namespace Kailab\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\Response;
use Kailab\FrontendBundle\Asset\AssetInterface;
use Imagine\ImageInterface;
use Imagine\Gd\Imagine;
use Imagine\Image\Box;


class TechnologyController extends Controller
{
    public function indexAction()
    {
        return $this->render('KailabFrontendBundle:Tecnology:index.html.twig');
    }

    public function imageAction($id)
    {
        // find slide
        $em = $this->get('doctrine')->getEntityManager();
        $repo = $em->getRepository('KailabFrontendBundle:Tech');
        $tech = $repo->find($id);
        if(!$tech){
            throw new NotFoundHttpException('The technology does not exist.');
        }
        $asset = $tech->getImage()->getAsset();
        if(!$asset instanceof AssetInterface){
            throw new NotFoundHttpException('The technology does not have a valid asset.');
        }

        // resize image
        $imagine = new Imagine();
        $image = $imagine->load($asset->getContent());
        $box = new Box(100, 100);
        $thumb = $image->thumbnail($box,ImageInterface::THUMBNAIL_OUTBOUND);

        // build response
        $response = new Response();
        $response->setContent($thumb->get('png'));
        $response->headers->set('Content-Type','image/png');
        return $response;
    }


}
