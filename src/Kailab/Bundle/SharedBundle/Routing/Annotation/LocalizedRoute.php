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
		$this->setPattern('/{_locale}'.$p);
		$reqs = $this->getRequirements();
		$reqs['_locale'] = '^(..|c)$';
		$this->setRequirements($reqs);
	}
}
