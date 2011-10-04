<?php

namespace Kailab\Bundle\FrontendBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class VideogamesController extends ApplicationsController
{
    protected function getAppType()
    {
    	return 'game';
    }
    
    /**
    * @Route("/games/showcase", name="frontend_videogames_showcase")
    * @Template()
    */
    public function showcaseAction()
    {
    	return parent::showcaseAction();
    }
    
    /**
     * @Route("/games", name="frontend_videogames")
     * @Template()
     */
    public function indexAction()
    {
    	return parent::indexAction();
    }
    
    /**
     * @Route("/games/{slug}", name="frontend_videogame")
     * @Template()
     */
    public function showAction($slug)
    {
		return parent::showAction($slug);
    }
}
