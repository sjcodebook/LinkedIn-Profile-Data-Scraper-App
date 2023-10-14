# LinkedIn Profile Data Scraper App

## Running the Web App Locally

1. Navigate to the `/app` directory.
2. Add the `DATABASE_URL` environment variable to the `.env` file.
3. Execute `npm run dev` to start the local development server at `localhost:3000`.
4. To build the application, run `npm run build`.
5. To launch the production build, run `npm run start`.
6. The application uses Prisma for MySQL database management, hosted on PlanetScale.
7. To apply changes to the database schema, execute `npm run db:push`.
8. For PlanetScale documentation, please visit [PlanetScale Tutorials](https://planetscale.com/docs/tutorials/connect-nextjs-app).

## LinkedIn Scraper App

1. The code for this app resides in the `/scraper-lambda` directory.
2. The code executes in an AWS Lambda function, hosted on AWS S3 and triggered at regular intervals by Amazon EventBridge.
3. Lambda function logs can be viewed in AWS CloudWatch.
4. The code is written in TypeScript, requiring compilation to JavaScript using `tsc`.
5. To compile, run the command `npm run build`.
6. The compiled code will be stored in the `build` directory.
7. To prepare the build directory for upload, zip it using the command `npm run zip`. This creates a zip file named `ts-lambda-screenshot`.
8. Navigate to the AWS console and create an S3 bucket. Upload the zip file and copy the S3 URI.
9. Create a new AWS Lambda function with the following general configuration:
   
10. To upload the source code to the Lambda function, select the 'Amazon S3 location' option from the 'Upload From' dropdown menu.
11. Paste the S3 object link that you copied in the previous step and click 'Save'.
12. The code will be uploaded and ready for use.
13. To set up a CRON job for the Lambda function, navigate to Amazon EventBridge.
14. Go to the 'Schedules' section within the 'Scheduler' area.
15. Click 'Create Schedule', enter the necessary information, and select the frequency at which you want to trigger the Lambda function.
16. For logs, please refer to the AWS CloudWatch Logs Explorer.
