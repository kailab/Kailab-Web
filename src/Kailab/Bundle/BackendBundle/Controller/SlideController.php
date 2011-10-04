<?php

namespace Kailab\Bundle\BackendBundle\Controller;

use Kailab\Bundle\SharedBundle\Controller\EntityCrudController;
use Kailab\Bundle\BackendBundle\Form\SlideType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;


class SlideController extends EntityCrudController
{    
    protected function getViewPrefix()
    {
    	return 'KailabBackendBundle:Slide';
    }
    
    protected function getRoutePrefix()
    {
    	return 'backend_slide_';
    }
    
    protected function getEntityName()
    {
    	return 'KailabEntityBundle:Slide';
    }

    protected function getFormType()
    {
        return new SlideType();
    }
    
    /**
    * @Route("/slide", name="backend_slide_index")
    * @Template()
    */
    public function indexAction()
    {
    	return parent::indexAction();
    }

    /**
    * @Route("/slide/new", name="backend_slide_new")
    * @Template()
    */
    public function newAction()
    {
    	return parent::newAction();
    }

    /**
    * @Route("/slide/{id}", name="backend_slide_edit")
    * @Template()
    */
    public function editAction($id)
    {
    	return parent::editAction($id);
    }
    
    /**
    * @Route("/slide/delete/{id}", name="backend_slide_delete")
    * @Template()
    */
    public function deleteAction($id)
    {
    	return parent::deleteAction($id);
    }
    
    /**
     * @Route("/slide/toggle/{id}", name="backend_slide_toggle")
     * @Template()
     */
    public function toggleAction($id)
    {
    	return parent::toggleAction($id);
    }

    /**
    * @Route("/slide/up/{id}", name="backend_slide_up")
    * @Template()
    */
    public function upAction($id)
    {
		return parent::upAction($id);
    }

    /**
    * @Route("/slide/down/{id}", name="backend_slide_down")
    * @Template()
    */
    public function downAction($id)
    {
		return parent::downAction($id);
    }

}
