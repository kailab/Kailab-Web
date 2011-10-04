<?php

namespace Kailab\Bundle\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\FlattenException;
use Symfony\Component\HttpKernel\Log\DebugLoggerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class ExceptionController extends Controller
{
	/**
	* @Route("/error401", name="frontend_error401")
	*/
    public function error401Action()
    {
    	$view = 'KailabFrontendBundle:Exception:error401.html.twig';
        return $this->render($view, array(
        ));
    }

    /**
    * @Route("/error401", name="frontend_error401")
    */
    public function error404Action()
    {
    	$view = 'KailabFrontendBundle:Exception:error404.html.twig';
        return $this->render($view, array(
        ));
    }

    /**
    * @Route("/error", name="frontend_error")
    */
    public function errorAction()
    {
    	$view = 'KailabFrontendBundle:Exception:error.html.twig';
        return $this->render($view, array(
        ));
    }

    public function exceptionAction(FlattenException $exception, DebugLoggerInterface $logger = null, $format = 'html', $embedded = false)
    {
        if($exception->getClass() == 'Symfony\Component\HttpKernel\Exception\NotFoundHttpException'){
            return $this->error404Action();
        }else if($exception->getClass() == 'Symfony\Component\Security\Core\Exception\AccessDeniedException'){
            return $this->error401Action();
        }else{
            return $this->errorAction();
        }
    }

}
 
