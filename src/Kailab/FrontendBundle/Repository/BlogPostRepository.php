<?php

namespace Kailab\FrontendBundle\Repository;

class BlogPostRepository extends EntityRepository
{
    protected $entity_name = 'KailabFrontendBundle:BlogPost';

    public function findAllActiveInPage($page, $limit = 10)
    {
        $offset = ($page >= 1 ? $page-1 : $page)*$limit;
        $offset = $offset < 0 ? 0 : $offset;
        return $this->createEntityQuery('WHERE e.active = true ORDER BY e.updated DESC')
            ->setFirstResult($offset)->setMaxResults($limit)->getResult();
    }

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
            return $this->createEntityQuery('WHERE e.active = true ORDER BY e.updated DESC')
                ->setMaxResults(1)->getSingleResult();
        }catch(\Exception $e){
            return null;
        }
    }
}
