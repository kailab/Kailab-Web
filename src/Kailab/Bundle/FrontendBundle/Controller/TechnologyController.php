<?php

namespace Kailab\Bundle\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Kailab\Bundle\SharedBundle\Routing\Annotation\LocalizedRoute as Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class TechnologyController extends Controller
{
	protected function getRepository()
	{
		$em = $this->get('doctrine')->getEntityManager();
		return $em->getRepository('KailabEntityBundle:Tech');
	}
	
	/**
	* @Route("/tech", name="frontend_technologies_showcase")
	* @Template()
	*/
    public function showcaseAction()
    {
		$repo = $this->getRepository();
        $techs = $repo->findAllActiveOrdered();

        return array(
            'techs'  => $techs
        );
    }

    /**
    * @Route("/tech/{slug}", name="frontend_technology")
    * @Template()
    */
    public function showAction($slug)
    {
        $repo = $this->getRepository();
        $tech = $repo->findActiveBySlug($slug);

        return array(
            'tech'  => $tech,
        );
    }

}
