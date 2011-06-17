<?php

namespace Kailab\FrontendBundle\Repository;

class BlogPostRepository extends EntityRepository
{
    protected $entity_name = 'KailabFrontendBundle:BlogPost';

    public function findAllActiveOrdered()
    {
        return $this->createEntityQuery('WHERE e.active = true ORDER BY e.updated DESC')
            ->getResult();
    }

    public function findAllActiveInCategoryOrdered($category)
    {
        return $this->createEntityQuery('WHERE e.active = true AND e.category = :category ORDER BY e.updated DESC')
            ->setParameter('category',$category)->getResult();
    }

    public function getCategoryPagination($category,$limit=10)
    {
        $query = $this->createCountEntityQuery('WHERE e.active = true AND e.category = :category ORDER BY e.updated DESC');
        $query->setParameter('category',$category);
        return $this->getQueryPagination($query,$limit);
    }

    public function findForHomepage()
    {
        try{
            return $this->createEntityQuery('WHERE e.active = true ORDER BY e.updated ASC')
                ->setMaxResults(1)->getSingleResult();
        }catch(\Exception $e){
            return null;
        }
    }
}
