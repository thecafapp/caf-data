import { TabPanel, Card, Text, Title } from "@tremor/react";
export default function ComingSoon() {
  return (
    <TabPanel>
      <div className="mt-6">
        <Card>
          <Title>Coming soon</Title>
          <Text>
            This feature will be available in a future version of Caf Data.
          </Text>
        </Card>
      </div>
    </TabPanel>
  );
}
