<?php

namespace Kailab\FrontendBundle\Repository;

class QuestionRepository extends EntityRepository
{
    protected $entity_name = 'KailabFrontendBundle:Question';

    public function findAllActiveOrdered($type='app')
    {
        return $this->createEntityQuery('WHERE e.active = true ORDER BY e.position DESC')
            ->getResult();
    }
}
