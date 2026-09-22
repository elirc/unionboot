// W423: Channel worker contracts / Drain channel batches of 3
namespace DotnetWeb;
public static class W423{

public static Task<int> Drain(ChannelReader<int> reader,ICollection<int> sink,CancellationToken token){
token.ThrowIfCancellationRequested();int n=0;while(n<3&&reader.TryRead(out var item)){sink.Add(item);n++;}return Task.FromResult(n);
}
}
