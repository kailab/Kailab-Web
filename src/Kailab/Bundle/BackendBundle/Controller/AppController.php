<?php

namespace Kailab\Bundle\BackendBundle\Controller;

use Kailab\Bundle\SharedBundle\Controller\EntityCrudController;
use Kailab\Bundle\BackendBundle\Form\AppType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class AppController extends EntityCrudController
{   
    protected function getEntityName()
    {
    	return 'KailabEntityBundle:App';
    }
    
    protected function getViewPrefix()
    {
    	return 'KailabBackendBundle:App';
    }
    
    protected function getRoutePrefix()
    {
    	return 'backend_app_';
    }

    protected function getFormType()
    {
        return new AppType();
    }

	protected function saveEntity($entity)
	{
		$repo = $this->getRepository();
		// remove old screenshots
		$repo->deleteScreenshots($entity);
		// fix links, setting translation
		$entity->fixLinks();
		// remove old links
		$repo->deleteLinks($entity);
		return parent::saveEntity($entity);
	}
	
	/**
	* @Route("/app", name="backend_app_index")
	* @Template()
	*/
	public function indexAction()
	{
		return parent::indexAction();
	}
	
	/**
	 * @Route("/app/new", name="backend_app_new")
	 * @Template()
	 */
	public function newAction()
	{
		return parent::newAction();
	}
	
	/**
	 * @Route("/app/{id}", name="backend_app_edit")
	 * @Template()
	 */
	public function editAction($id)
	{
		return parent::editAction($id);
	}
	
	/**
	* @Route("/app/delete/{id}", name="backend_app_delete")
	* @Template()
	*/
	public function deleteAction($id)
	{
		return parent::deleteAction($id);
	}
	
	/**
	* @Route("/app/toggle/{id}", name="backend_app_toggle")
	* @Template()
	*/
	public function toggleAction($id)
	{
		return parent::toggleAction($id);
	}
	
  	/**
    * @Route("/app/up/{id}", name="backend_app_up")
    * @Template()
    */
    public function upAction($id)
    {
		return parent::upAction($id);
    }

    /**
    * @Route("/app/down/{id}", name="backend_app_down")
    * @Template()
    */    
    public function downAction($id)
    {
		return parent::downAction($id);
    }
}
