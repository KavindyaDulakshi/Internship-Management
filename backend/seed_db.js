const { supabase } = require('./src/config/supabase');

const companiesData = [
  {
    name: 'Vercel',
    logo_url: 'V',
    website: 'https://vercel.com',
    description: 'Vercel provides the developer experience and infrastructure to build, deploy, and scale the web.'
  },
  {
    name: 'Linear',
    logo_url: 'L',
    website: 'https://linear.app',
    description: 'Linear helps software teams streamline projects, tasks, bugs, and product roadmaps.'
  },
  {
    name: 'Stripe',
    logo_url: 'S',
    website: 'https://stripe.com',
    description: 'Stripe is a financial infrastructure platform for the internet.'
  },
  {
    name: 'OpenAI',
    logo_url: 'O',
    website: 'https://openai.com',
    description: 'OpenAI is an AI research and deployment company.'
  },
  {
    name: 'Notion',
    logo_url: 'N',
    website: 'https://notion.so',
    description: 'Notion is a single space where you can think, write, and plan.'
  },
  {
    name: 'Figma',
    logo_url: 'F',
    website: 'https://figma.com',
    description: 'Figma is a leading collaborative design tool.'
  }
];

const internshipsData = [
  {
    company_name: 'Vercel',
    title: 'Frontend Engineering Intern',
    location: 'San Francisco, CA (Hybrid)',
    duration: '12 weeks',
    salary: '$8,000/mo',
    type: 'Software Engineering',
    description: 'Join the Vercel frontend team to build and optimize the dashboard experience used by millions of developers.'
  },
  {
    company_name: 'Linear',
    title: 'Software Engineer Intern',
    location: 'Remote',
    duration: '16 weeks',
    salary: '$7,500/mo',
    type: 'Software Engineering',
    description: 'Work alongside the Linear engineering team on the product used by the world\'s best engineering teams.'
  },
  {
    company_name: 'Stripe',
    title: 'Product Design Intern',
    location: 'New York, NY',
    duration: '10 weeks',
    salary: '$9,000/mo',
    type: 'Design',
    description: 'Design world-class financial tools used by millions of businesses worldwide.'
  },
  {
    company_name: 'OpenAI',
    title: 'AI/ML Research Intern',
    location: 'San Francisco, CA',
    duration: '12 weeks',
    salary: '$10,000/mo',
    type: 'AI/ML',
    description: 'Contribute to cutting-edge AI research and help build the future of AI safely.'
  },
  {
    company_name: 'Notion',
    title: 'Full Stack Developer Intern',
    location: 'Remote',
    duration: '14 weeks',
    salary: '$6,500/mo',
    type: 'Software Engineering',
    description: 'Help build the all-in-one workspace for teams and individuals.'
  },
  {
    company_name: 'Figma',
    title: 'Data Science Intern',
    location: 'San Francisco, CA (Hybrid)',
    duration: '12 weeks',
    salary: '$7,000/mo',
    type: 'Data Science',
    description: 'Drive data-informed decisions to improve the Figma product experience.'
  }
];

async function seed() {
  try {
    console.log('Cleaning up existing database data...');
    // Clear applications and internships (saved_internships doesn't exist, profiles we keep)
    await supabase.from('applications').delete().neq('id', 0);
    await supabase.from('internships').delete().neq('id', 0);
    await supabase.from('companies').delete().neq('id', 0);

    console.log('Inserting companies...');
    const { data: insertedCompanies, error: compError } = await supabase
      .from('companies')
      .insert(companiesData)
      .select();

    if (compError) {
      console.error('Error inserting companies:', compError);
      return;
    }

    console.log(`Inserted ${insertedCompanies.length} companies.`);

    const companyMap = {};
    insertedCompanies.forEach(c => {
      companyMap[c.name] = c.id;
    });

    const internshipsToInsert = internshipsData.map(intern => {
      const companyId = companyMap[intern.company_name];
      if (!companyId) {
        throw new Error(`Company ID not found for ${intern.company_name}`);
      }
      return {
        company_id: companyId,
        title: intern.title,
        location: intern.location,
        duration: intern.duration,
        salary: intern.salary,
        work_type: intern.type,
        description: intern.description
      };
    });

    console.log('Inserting internships...');
    const { data: insertedInternships, error: internError } = await supabase
      .from('internships')
      .insert(internshipsToInsert)
      .select();

    if (internError) {
      console.error('Error inserting internships:', internError);
      return;
    }

    console.log(`Inserted ${insertedInternships.length} internships.`);
    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Seeding failed:', err);
  }
}

seed();
