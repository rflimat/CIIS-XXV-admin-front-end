import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { TallerInformacion } from "src/sections/taller/inscritos-table";
import { TallerTable } from "src/sections/taller/taller-table";
import URI from "src/contexts/url-context";
import { saveOnChest, takeFromChest } from "src/utils/chest";
import { useRouter } from "next/router";
import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { TablaInscritos } from "src/sections/taller/inscritos-table";

const Page = () => {
  let taller = takeFromChest("taller");
  // console.log(taller);

  return (
    <>
      <Head>
        <title>Taller específico</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Taller {`"${taller.name}"`}</Typography>
            </div>
            <div>
              <Grid xs={12} md={6} lg={8}>
                <TablaInscritos primTaller={taller} />
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
