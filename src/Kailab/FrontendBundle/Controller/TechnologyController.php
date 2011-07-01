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

    protected function resizeAsset(AssetInterface $asset, $w, $h)
    {
        $imagine = new Imagine();
        $image = $imagine->load($asset->getContent());
        $image = $image->resize(new Box($w,$h), ImageInterface::THUMBNAIL_OUTBOUND);

        return new ParameterAsset(array(
            'content'       => $image->get('png'),
            'content_type'  => 'image/png'
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
        return $this->resizeAsset($asset,30,30)->getResponse();
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
        return $this->resizeAsset($asset,150,150)->getResponse();
    }




}
