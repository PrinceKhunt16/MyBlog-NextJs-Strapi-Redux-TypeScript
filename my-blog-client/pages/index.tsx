import axios, { AxiosResponse } from 'axios'
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import ArticleList from '../components/ArticleList'
import Tabs from '../components/Tabs'
import { IArticle, ICategory, ICollectionResponse, IPagination, IQueryOptions } from '../types'
import qs from 'qs'
import Pagination from '../components/Pagination'
import { useRouter } from 'next/router'
import { debounce } from '../utils'

interface IPropTypes {
  categories: {
    items: ICategory[]
  },
  articles: {
    items: IArticle[]
    pagination: IPagination
  },
}

export default function Home({ categories, articles }: IPropTypes) {
  const router = useRouter()
  const { page, pageCount } = articles.pagination

  const handleSearch = (query: string) => {
    router.push(`/?search=${query}`)
  }

  return (
    <div>
      <Head>
        <title>My Blog Home</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Tabs
        categories={categories.items}
        handleSearch={debounce(handleSearch, 500)}
      />
      <ArticleList
        articles={articles.items}
      />
      <Pagination
        page={page}
        pageCount={pageCount}
      />
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const options: Partial<IQueryOptions> = {
    populate: ['author.avatar'],
    sort: ['id:desc'],
    pagination: {
      page: context.query.page ? +context.query.page : 1,
      pageSize: 8
    }
  }

  if (context.query.search) {
    options.filters = {
      Title: {
        $containsi: context.query.search
      }
    }
  }

  const queryString = qs.stringify(options)

  const config = {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_BASE_API_KEY}`
    }
  }

  const { data: articles }: AxiosResponse<ICollectionResponse<IArticle[]>> = await axios.get(`${process.env.API_BASE_URL}/api/articles?${queryString}`, config)

  const { data: categories }: AxiosResponse<ICollectionResponse<ICategory[]>> = await axios.get(`${process.env.API_BASE_URL}/api/categories`, config)

  return {
    props: {
      categories: {
        items: categories.data
      },
      articles: {
        items: articles.data,
        pagination: articles.meta.pagination
      }
    }
  }
}