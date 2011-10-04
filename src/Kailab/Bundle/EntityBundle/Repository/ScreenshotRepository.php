<?php

namespace Kailab\Bundle\EntityBundle\Repository;

use Kailab\Bundle\SharedBundle\Repository\EntityRepository;

class ScreenshotRepository extends EntityRepository
{
	public function findAllIds()
	{
		$q = $this->createEntityQuery('', 'e.id');
		$ids = array();
		foreach($q->getResult() as $row){
			if(isset($row['id'])){
				$ids[] = $row['id'];
			}
		}
		return $ids;
	}
}
