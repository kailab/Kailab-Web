<?php 

namespace Kailab\Bundle\SharedBundle\Routing\Annotation;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

/**
* @Annotation
*/
class LocalizedRoute extends Route
{
	public function __construct(array $data)
	{
		parent::__construct($data);
		$p = $this->getPattern();
		// strip trailing slash
		$p = substr($p,-1) == '/' ? substr($p,0,-1) : $p;
		$this->setPattern('/{_locale}'.$p);
		$reqs = $this->getRequirements();
		$reqs['_locale'] = '^(..|c)$';
		$this->setRequirements($reqs);
		$defaults = $this->getDefaults();
		$defaults['_locale'] = 'c';
		$this->setDefaults($defaults);
	}
}