<?php

namespace Kailab\Bundle\SharedBundle\Templating\Twig\Extension;

use Symfony\Component\Templating\Helper\Helper;

/**
 * Adds some useful text functions
 */
class HtmlExtension extends \Twig_Extension
{
	public function getFilters()
	{
		$filters = array();
		$filters['mailto'] = new \Twig_Filter_Method($this, 'mailto', array('pre_escape' => 'html', 'is_safe' => array('html')));
		$filters['callto'] = new \Twig_Filter_Method($this, 'callto', array('pre_escape' => 'html', 'is_safe' => array('html')));
		return $filters;
	}
	
	public function getName()
	{
		return "kailab_text";
	}
	
	public function mailto($email,$text=null,$secure=false)
	{
		$text = $text ? $text : $email;
		if($secure){
			$html  = '<a href="mailto:'.$email.'">'.$text.'</a>';
			return $html;
				
		}
		$text = str_replace('@',"'+'@'+'",$text);
		$email = str_replace('@',"'+'@'+'",$email);
		$html  = '<script type="text/javascript">';
		$html .= 'document.write(\'<a href="mailto:'.$email.'">'.$text.'</a>\');';
		$html .= '</script>';
		return $html;
	}
	
	public function callto($number,$text=null)
	{
		$text = $text ? $text : $number;
		$html  = '<a href="tel:'.$number.'">'.$text.'</a>';
		return $html;
	}
}