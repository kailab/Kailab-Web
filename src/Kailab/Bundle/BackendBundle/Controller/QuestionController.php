<?php

namespace Kailab\Bundle\BackendBundle\Controller;

use Kailab\Bundle\SharedBundle\Controller\EntityCrudController;
use Kailab\Bundle\BackendBundle\Form\QuestionType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class QuestionController extends EntityCrudController
{
    protected function getEntityName()
    {
    	return 'KailabEntityBundle:Question';
    }
    
    protected function getViewPrefix()
    {
    	return 'KailabBackendBundle:Question';
    }
    
    protected function getRoutePrefix()
    {
    	return 'backend_question_';
    }

    protected function getFormType()
    {
        return new QuestionType();
    }
    
    /**
    * @Route("/question", name="backend_question_index")
    * @Template()
    */
    public function indexAction()
    {
    	return parent::indexAction();
    }
    
    /**
     * @Route("/question/new", name="backend_question_new")
     * @Template()
     */
    public function newAction()
    {
    	return parent::newAction();
    }
    
    /**
     * @Route("/question/{id}", name="backend_question_edit")
     * @Template()
     */
    public function editAction($id)
    {
    	return parent::editAction($id);
    }
    
    /**
    * @Route("/question/delete/{id}", name="backend_question_delete")
    * @Template()
    */
    public function deleteAction($id)
    {
    	return parent::deleteAction($id);
    }
    
    /**
     * @Route("/question/toggle/{id}", name="backend_question_toggle")
     * @Template()
     */
    public function toggleAction($id)
    {
    	return parent::toggleAction($id);
    }
    

    /**
    * @Route("/question/up/{id}", name="backend_question_up")
    * @Template()
    */
    public function upAction($id)
    {
		return parent::upAction($id);
    }

    /**
    * @Route("/question/down/{id}", name="backend_question_down")
    * @Template()
    */
    public function downAction($id)
    {
		return parent::downAction($id);
    }

}
