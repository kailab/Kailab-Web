<?php

namespace Kailab\Bundle\SharedBundle\Entity;

use Symfony\Component\DependencyInjection\Container;

use Doctrine\Common\Collections\ArrayCollection;

abstract class TranslatedEntity
{
	protected $locale = null;
	protected $translations = null;
	
	public function __construct()
	{
		$this->translations = new ArrayCollection();
	}
	
	public function setCurrentLocale($locale)
	{
		$this->locale = $locale;
	}
	
	public function getCurrentLocale()
	{
		return $this->locale;
	}
	
	public function getTranslations()
	{
		return $this->translations;
	}
	
	public function setTranslations($trans)
	{
		$this->translations = $trans;
	}
	
	public function getTranslation()
	{
		$locale = $this->getCurrentLocale();
		$trans = $this->getTranslations();
		foreach($trans as $t){
			if($t->getLocale() == $locale){
				return $t;
			}
		}
		return $trans->first();
	}
	
	public function getTranslated($name)
	{
		$t = $this->getTranslation();
		$method = 'get'.Container::camelize($name);
		if(is_object($t) && method_exists($t, $method)){
			return $t->$method();
		}
	}
	
}