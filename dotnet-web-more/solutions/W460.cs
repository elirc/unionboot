// W460: Options post-configure validation / Normalize then validate multiplier 11
namespace DotnetWeb;
public static class W460{
public sealed class Settings{public int Limit{get;set;}}
public static ServiceProvider Configure(int initial){
var services=new ServiceCollection();services.AddOptions<Settings>().Configure(o=>o.Limit=initial).PostConfigure(o=>{if(o.Limit==0)o.Limit=1;o.Limit*=11;}).Validate(o=>o.Limit>0&&o.Limit<=110,"limit outside range");return services.BuildServiceProvider();
}
}
