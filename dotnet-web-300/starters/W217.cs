// W217: Authorization policy registration / scenario 7
// permission-7 requires authenticated permission files.read
// Read prompts/W217.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W217 {

 public static void Configure(IServiceCollection services) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W217");
 }
}
