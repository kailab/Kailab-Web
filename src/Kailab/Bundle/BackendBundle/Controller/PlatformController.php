<?php

namespace Kailab\Bundle\BackendBundle\Controller;

use Kailab\Bundle\SharedBundle\Controller\EntityCrudController;
use Kailab\Bundle\BackendBundle\Form\PlatformType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class PlatformController extends EntityCrudController
{
    protected function getEntityName()
    {
    	return 'KailabEntityBundle:Platform';
    }
    
    protected function getViewPrefix()
    {
    	return 'KailabBackendBundle:Platform';
    }
    
    protected function getRoutePrefix()
    {
    	return 'backend_platform_';
    }

    protected function getFormType()
    {
        return new PlatformType();
    }
    
    /**
    * @Route("/platform", name="backend_platform_index")
    * @Template()
    */
    public function indexAction()
    {
    	return parent::indexAction();
    }
    
    /**
     * @Route("/platform/new", name="backend_platform_new")
     * @Template()
     */
    public function newAction()
    {
    	return parent::newAction();
    }
    
    /**
     * @Route("/platform/{id}", name="backend_platform_edit")
     * @Template()
     */
    public function editAction($id)
    {
    	return parent::editAction($id);
    }
    
    
    /**
    * @Route("/platform/delete/{id}", name="backend_platform_delete")
     * @Template()
    */
    public function deleteAction($id)
    {
    return parent::deleteAction($id);
    }
}
