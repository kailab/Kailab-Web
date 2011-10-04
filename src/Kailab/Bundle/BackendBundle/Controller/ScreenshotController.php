<?php

namespace Kailab\Bundle\BackendBundle\Controller;

use Symfony\Component\HttpFoundation\Response;

use Kailab\Bundle\SharedBundle\Controller\EntityCrudController;
use Kailab\Bundle\BackendBundle\Form\ScreenshotType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class ScreenshotController extends EntityCrudController
{
    protected $limit = 8;
    
    protected function getEntityName()
    {
    	return 'KailabEntityBundle:Screenshot';
    }
    
    protected function getViewPrefix()
    {
    	return 'KailabBackendBundle:Screenshot';
    }
    
    protected function getRoutePrefix()
    {
    	return 'backend_screenshot_';
    }

    protected function getFormType()
    {
        return new ScreenshotType();
    }
    
    /**
    * @Route("/screenshot", name="backend_screenshot_index")
    * @Template()
    */
    public function indexAction()
    {
    	return parent::indexAction();
    }
    
    /**
     * @Route("/screenshot/new", name="backend_screenshot_new")
     * @Template()
     */
    public function newAction()
    {
    	return parent::newAction();
    }
    
    /**
    * @Route("/screenshot/reload", name="backend_screenshot_reload_all")
    * @Template()
    */
    public function reloadAllAction()
    {
    	$repo = $this->getRepository();
    	$router = $this->get('router');
    	$urls = array();
    	foreach($repo->findAllIds() as $id){
    		$urls[$id] = $router->generate('backend_screenshot_reload', array('id' => $id));
    	}
    	return array(
        	'urls'	=> $urls 
    	);
    }
    
    /**
     * @Route("/screenshot/reload/{id}", name="backend_screenshot_reload")
     */
    public function reloadAction($id)
    {
    	$repo = $this->getRepository();
    	$em = $this->getEntityManager();
    	$response = new Response();
    	try{    
	    	$entity = $repo->find($id);
	    	$entity->setUpdated(new \DateTime('now'));
	    	$em->persist($entity);
	    	$em->flush();
	    	$response->setContent('true');
    	}catch(\Exception $e){
    		$response->setStatusCode(500);
    	}
		return $response;
    }
    
    /**
     * @Route("/screenshot/{id}", name="backend_screenshot_edit")
     * @Template()
     */
    public function editAction($id)
    {
    	return parent::editAction($id);
    }
    
    /**
    * @Route("/screenshot/delete/{id}", name="backend_screenshot_delete")
    * @Template()
    */
    public function deleteAction($id)
    {
    	return parent::deleteAction($id);
    }
    
}
