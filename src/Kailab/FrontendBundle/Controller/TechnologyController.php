<?php

namespace Kailab\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\Response;
use Kailab\FrontendBundle\Asset\AssetInterface;
use Kailab\FrontendBundle\Asset\ParameterAsset;
use Imagine\ImageInterface;
use Imagine\Gd\Imagine;
use Imagine\Image\Box;

class TechnologyController extends Controller
{
    public function showcaseAction()
    {
        $em = $this->get('doctrine')->getEntityManager();

        $repo = $em->getRepository('KailabFrontendBundle:Tech');
        $techs = $repo->findAllActiveOrdered();

        $view = 'KailabFrontendBundle:Technology:showcase.html.twig';
        return $this->render($view,array(
            'techs'  => $techs
        ));
    }

    public function showAction($slug)
    {
        $em = $this->get('doctrine')->getEntityManager();

        $repo = $em->getRepository('KailabFrontendBundle:Tech');
        $tech = $repo->findActiveBySlug($slug);



        $view = 'KailabFrontendBundle:Technology:show.html.twig';
        return $this->render($view,array(
            'tech'  => $tech,
        ));
    }

}
