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
        $em = $this->get('doctrine')->getEntityManager();

        $repo = $em->getRepository('KailabFrontendBundle:Tech');
        $techs = $repo->findAllActiveOrdered();

        $view = 'KailabFrontendBundle:Technology:index.html.twig';
        return $this->render($view,array(
            'techs'  => $techs
        ));
    }

    public function iconAction($id)
    {
        // find technology
        $em = $this->get('doctrine')->getEntityManager();
        $repo = $em->getRepository('KailabFrontendBundle:Tech');
        $tech = $repo->find($id);
        if(!$tech){
            throw new NotFoundHttpException('The technology does not exist.');
        }
        $asset = $tech->getIcon()->getAsset();
        if(!$asset instanceof AssetInterface){
            throw new NotFoundHttpException('The technology does not have a valid icon.');
        }
        return $asset->getResponse();
    }

    public function imageAction($id)
    {
        // find technology
        $em = $this->get('doctrine')->getEntityManager();
        $repo = $em->getRepository('KailabFrontendBundle:Tech');
        $tech = $repo->find($id);
        if(!$tech){
            throw new NotFoundHttpException('The technology does not exist.');
        }
        $asset = $tech->getImage()->getAsset();
        if(!$asset instanceof AssetInterface){
            throw new NotFoundHttpException('The technology does not have a valid image.');
        }
        return $asset->getResponse();
    }




}
