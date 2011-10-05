<?php

namespace Kailab\Bundle\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Kailab\Bundle\SharedBundle\Routing\Annotation\LocalizedRoute as Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class ApplicationsController extends Controller
{   
    protected function getAppType()
    {
    	return 'app';
    }

    /**
    * @Route("/apps/showcase", name="frontend_applications_showcase")
    * @Template()
    */
    public function showcaseAction()
    {
        $em = $this->get('doctrine')->getEntityManager();

        $repo = $em->getRepository('KailabEntityBundle:App');
        $apps = $repo->findAllActiveOrdered($this->getAppType(),5);

        $pager = $repo->getActivePagination(5);

        return array(
            'apps'  => $apps,
            'more'  => $pager['last'] > 1
        );
    }

    /**
    * @Route("/apps", name="frontend_applications")
    * @Template()
    */
    public function indexAction()
    {
        $em = $this->get('doctrine')->getEntityManager();

        $repo = $em->getRepository('KailabEntityBundle:App');
        $apps = $repo->findAllActiveOrdered($this->getAppType(),15);

        return array(
            'apps'  => $apps
        );
    }

    /**
    * @Route("/apps/{slug}", name="frontend_application")
    * @Template()
    */
    public function showAction($slug)
    {
        $em = $this->get('doctrine')->getEntityManager();

        $repo = $em->getRepository('KailabEntityBundle:App');
        $app = $repo->findActiveBySlug($slug,$this->getAppType());

        if(!$app){
            throw new NotFoundHttpException('The application does not exist.');
        }
        
        return array(
            'appli'  => $app
        );
    }
}
