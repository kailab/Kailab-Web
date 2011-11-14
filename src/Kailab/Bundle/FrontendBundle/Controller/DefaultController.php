<?php

namespace Kailab\Bundle\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Kailab\Bundle\SharedBundle\Routing\Annotation\LocalizedRoute as Route;

class DefaultController extends Controller
{
	/**
	* @Route("", name="frontend_homepage")
	* @Route("/", name="frontend_homepage_slash")
	* @Template()
	*/
    public function indexAction()
    {
        $em = $this->get('doctrine')->getEntityManager();

        $repo = $em->getRepository('KailabEntityBundle:Slide');
        $slides = $repo->findAllActiveOrdered();

        $repo = $em->getRepository('KailabEntityBundle:App');
        $app = $repo->findForHomepage('app');
        $game = $repo->findForHomepage('game');

        $repo = $em->getRepository('KailabEntityBundle:BlogPost');
        $post = $repo->findForHomepage();

        return array(
            'slides'    => $slides,
            'appli'     => $app,
            'game'      => $game,
            'post'      => $post,
        );
    }

    /**
    * @Route("/about", name="frontend_about")
    * @Template()
    */
    public function aboutAction()
    {
        return array();
    }

    /**
    * @Route("/contact", name="frontend_contact")
    * @Template()
    */
    public function contactAction()
    {
    	return array();
    }

    /**
    * @Route("/legal", name="frontend_legal")
    * @Template()
    */
    public function legalAction()
    {
        return array();
    }

    /**
    * @Route("/faq", name="frontend_faq")
    * @Template()
    */
    public function faqAction()
    {
        $em = $this->get('doctrine')->getEntityManager();

        $repo = $em->getRepository('KailabEntityBundle:Question');
        $questions = $repo->findAllActiveOrdered();

        return array(
            'questions' => $questions
        );
    }

}
