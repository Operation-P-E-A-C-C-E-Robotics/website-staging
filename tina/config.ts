import { defineConfig } from "tinacms";
import { date } from "zod";

// Your hosting provider likely exposes this as an environment variable
 const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  ''
 const clientId = process.env.TINA_PUBLIC_CLIENT_ID || null
 const token = process.env.TINA_TOKEN || null
 
export default defineConfig({
  branch,
  clientId, // Get this from tina.io
  token, // Get this from tina.io

  build: {
    outputFolder: "admin",
    publicFolder: "/",
  },
  media: {
    tina: {
      mediaRoot: "/assets",
      publicFolder: "/",
    },
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Blog Posts",
        path: "/_posts",
        ui: {
          filename: {
            // if disabled, the editor can not edit the filename
            readonly: true,
            // Example of using a custom slugify function
            slugify: values => {
              // Values is an object containing all the values of the form. In this case it is {title?: string, topic?: string}
              return `${new Date(Date.now()).toISOString().split('T')[0] ||
                'no-topic'}-${values?.title?.toLowerCase().replace(/ /g, '-')}`
            },
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "author",
            label: "Author",
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
          {
          label: "Published",
          name: "published",
          type: "boolean",
          },
        ],
      },
      {
        name: "robots",
        label: "Robot Profiles",
        path: "/_robots",
        defaultItem: () => {
          return {
            // When a new post is created the title field will be set to "New post"
            year: `${new Date(Date.now()).getFullYear()}`,
            robotName: 'Unnamed Robot',
            metatitle: `${new Date(Date.now()).getFullYear()} Robot: ROBOT NAME`,
            metadesc: `GAME NAME Performance and Statistics`,
          }
        },
        ui: {
          filename: {
            // if disabled, the editor can not edit the filename
            readonly: true,
            // Example of using a custom slugify function
            slugify: values => {
              // Values is an object containing all the values of the form. In this case it is {title?: string, topic?: string}
              return `${values?.year}`
            },
          },
        },
        fields: [
          {
            name: 'year',
            label: 'Year',
            type: 'number',
          },
          {
            name: 'robotName',
            label: 'Robot Name',
            type: 'string',
          },
          {
            name: 'game',
            label: 'Game Name',
            type: 'string',
          },
          {
            name: 'thumbnail',
            label: 'Thumbnail Image',
            type: 'image',
          },
          {
            name: 'metatitle',
            label: 'Meta Title',
            type: 'string',
          },
          {
            name: 'metadesc',
            label: 'Meta Description',
            type: 'string',
          },
          {
            type: "rich-text",
            name: "body",
            label: "Write Up",
            isBody: true,
          },
          {
            label: "Published",
            name: "published",
            type: "boolean",
            },
        ],
      },
    {
      name: "about",
      label: "Top Level Pages",
      path: "/",
      match: {
        include: '*',
      },
     format: "md",
     fields: [
      {
        type: "string",
        name: "title",
        label: "Title",
        isTitle: true,
        required: true,
      },
      {
        type: "string",
        name: "layout",
        label: "Page Layout",
        required: true,
      },
      {
        type: "rich-text",
        name: "body",
        label: "Body",
        isBody: true,
      },
      {
      label: "Published",
      name: "published",
      type: "boolean",
      },
     ],
   },
       //   {
    //     name: "contact",
    //     label: "Contact",
    //     path: "_data",
    //     match: {
    //         // name of the data file
    //         include: "contact",
    //     },
    //    format: "yaml",
    //    fields: [
    //      // contact fields here 
    //    ],
    //  },
     {
        name: "index",
        label: "Home Page Config",
        path: "_data",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        match: {
            // name of the data file
            include: "index",
        },
       format: "yaml",
       fields: [
        {
          label: "Banner Image",
          name: "banner",
          type: "object",
          fields: [
            {
              label: "Image",
              name: "imageurl",
              nameOverride: 'image-url',
              type: "image"
            },
            {
              label: "Image Align",
              name: "imagealign",
              nameOverride: 'image-align',
              type: "string",
              options: [{
                value: "top",
                label: "Top"
              }, 
              {
                value: "left",
                label: "Left"
              },
              {
                value: "center",
                label: "Center"
              },
              {
                value: "right",
                label: "Right"
              },
              {
                value: "bottom",
                label: "Bottom"
              },
              {
                value: "inherit",
                label: "Inherit/Default"
              },

            ]
            },
            {
              label: "Header",
              name: "header",
              type: "string"
            },
            {
              label: "Sub Header",
              name: "subheader",
              type: "string"
            },
          ]
        },
        {
          label: "Subbanner Text",
          name: "subbanner",
          type: "object",
          fields: [
            {
              label: "Header",
              name: "text",
              type: "string"
            },
            {
              label: "Sub Header",
              name: "subtext",
              type: "rich-text"
            },
          ]
        },
        {
        label: "Text/Image Columns",
        name: "content",
        type: "object",
        list: true,
        ui: {
          // This allows the customization of the list item UI
          // Data can be accessed by item?.<Name of field>
          itemProps: (item) => {
            return { label: `${item?.header}`}
          },
        },
        fields: [
          {
            label: "Header",
            name: "header",
            type: "string"
          },
          {
            label: "Content",
            name: "content",
            type: "rich-text"
          },
          {
            label: "Glyph",
            name: "glyph",
            type: "image",
          },
          {
            label: "Image",
            name: "image",
            type: "image",
          },
        ]
      },
    ],
     },
     
    ],
  },
  
});