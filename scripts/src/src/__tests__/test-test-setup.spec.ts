import { instance, mock, when } from "ts-mockito";

class SomeTsMockitoTest {
  public helloTsMockito(): string {
    return "foo bar";
  }
}

class SomeTsMockitoTestCaller {
  constructor(private someTsMockitoTest: SomeTsMockitoTest) {}

  public call(): string {
    return this.someTsMockitoTest.helloTsMockito();
  }
}

describe("TestSetup", () => {
  it("should execute this test", () => {
    const serviceMock = mock(SomeTsMockitoTest);
    when(serviceMock.helloTsMockito()).thenReturn("foo MOCKED");
    const serviceMockInstance = instance(serviceMock);

    const callerWithMock = new SomeTsMockitoTestCaller(serviceMockInstance);

    const result = callerWithMock.call();

    expect(result).toBe("foo MOCKED");
  });
});
