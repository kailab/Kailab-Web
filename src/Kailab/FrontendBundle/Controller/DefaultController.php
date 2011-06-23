<?php

namespace Kailab\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\Response;
use Kailab\FrontendBundle\Asset\AssetInterface;
use Imagine\ImageInterface;
use Imagine\Gd\Imagine;
use Imagine\Image\Box;

class DefaultController extends Controller
{
    public function indexAction()
    {
        $em = $this->get('doctrine')->getEntityManager();

        $repo = $em->getRepository('KailabFrontendBundle:Slide');
        $slides = $repo->findAllActiveOrdered();

        $repo = $em->getRepository('KailabFrontendBundle:App');
        $app = $repo->findForHomepage('app');
        $game = $repo->findForHomepage('game');

        $repo = $em->getRepository('KailabFrontendBundle:BlogPost');
        $post = $repo->findForHomepage();

        return $this->render('KailabFrontendBundle:Default:index.html.twig',array(
            'slides'    => $slides,
            'appli'     => $app,
            'game'      => $game,
            'post'      => $post,
        ));
    }

    public function slideAction($id)
    {
        // find slide
        $em = $this->get('doctrine')->getEntityManager();
        $repo = $em->getRepository('KailabFrontendBundle:Slide');
        $slide = $repo->find($id);
        if(!$slide){
            throw new NotFoundHttpException('The slide does not exist.');
        }
        $asset = $slide->getImage()->getAsset();
        if(!$asset instanceof AssetInterface){
            throw new NotFoundHttpException('The slide does not have a valid asset.');
        }

        // resize image
        $imagine = new Imagine();
        $image = $imagine->load($asset->getContent());
        $box = new Box(470, 440);
        $thumb = $image->thumbnail($box,ImageInterface::THUMBNAIL_OUTBOUND);

        // build response
        $response = new Response();
        $response->setContent($thumb->get('png'));
        $response->headers->set('Content-Type','image/png');
        return $response;
    }

    public function aboutAction()
    {
        return $this->render('KailabFrontendBundle:Default:about.html.twig');
    }

    public function contactAction()
    {
        return $this->render('KailabFrontendBundle:Default:contact.html.twig');
    }

    public function legalAction()
    {
        return $this->render('KailabFrontendBundle:Default:legal.html.twig');
    }

    public function faqAction()
    {
        $em = $this->get('doctrine')->getEntityManager();

        $repo = $em->getRepository('KailabFrontendBundle:Question');
        $questions = $repo->findAllActiveOrdered();

        return $this->render('KailabFrontendBundle:Default:faq.html.twig', array(
            'questions' => $questions
        ));
    }

}
