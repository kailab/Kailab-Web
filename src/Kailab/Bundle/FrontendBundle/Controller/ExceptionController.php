<?php

namespace Kailab\Bundle\FrontendBundle\Controller;


use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\FlattenException;
use Symfony\Component\HttpKernel\Log\DebugLoggerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Kailab\Bundle\SharedBundle\Routing\Annotation\LocalizedRoute as Route;

class ExceptionController extends Controller
{
	/**
	* @Route("/fail", name="frontend_fail")
	*/
	public function failAction()
	{
		throw new \Exception('This is a test exception to see if the app catches it.');
	}
	
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
    * @Route("/error404", name="frontend_error404")
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
    public function errorAction(\Exception $exception=null)
    {
    	$view = 'KailabFrontendBundle:Exception:error.html.twig';
    	$data = array('title'=>null, 'text'=>null);
    	if($exception){
    		$data['title'] = $this->getClassName($exception);
    		$data['text'] = $exception->getMessage();
    	}
        return $this->render($view, $data);
    }

    public function exceptionAction(\Exception $exception)
    {
    	$class = $this->getClassName($exception);
        if($class == 'NotFoundHttpException'){
            return $this->error404Action();
        }else if($class== 'AccessDeniedException'){
            return $this->error401Action();
        }else{
            return $this->errorAction($exception);
        }
    }
    
    protected function getClassName($obj)
    {
    	if(is_object($obj)){
	    	$class = explode('\\',get_class($obj));
	    	return end($class);
    	}
    }
    
    public function onKernelException(GetResponseForExceptionEvent $event)
	{
		$kernel = $this->get('kernel');
		if($kernel->isDebug()){
			return;
		}
		$exception = $event->getException();
		$response = $this->exceptionAction($exception);
		
		if($response instanceof Response){
			$event->setResponse($response);
			$event->stopPropagation();
		}
	}
}
